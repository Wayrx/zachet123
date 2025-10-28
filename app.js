/**
 * Главный класс приложения
 * Координирует работу всех компонентов
 */
class AnimationApp {
    constructor() {
        this.canvas = null;
        this.engine = null;
        this.scene = null;
        this.animationLoader = null;
        this.animationFacade = null;
        
        this.init();
    }

    /**
     * Инициализирует приложение
     */
    async init() {
        try {
            // Инициализация Babylon.js
            this.canvas = document.getElementById("renderCanvas");
            this.engine = new BABYLON.Engine(this.canvas, true);
            this.scene = this.createScene();

            // Создаем загрузчик анимаций
            this.animationLoader = new AnimationLoader(this.scene);
            
            // Загружаем модель
            await this.animationLoader.loadModel(AnimationConfig.model.url);
            
            // Создаем фасад анимаций
            this.animationFacade = new AnimationFacade(this.animationLoader, AnimationConfig);
            
            // Настраиваем UI
            this.setupUI();
            
            // Запускаем рендер loop
            this.engine.runRenderLoop(() => {
                this.scene.render();
            });

            // Обработчик изменения размера окна
            window.addEventListener("resize", () => {
                this.engine.resize();
            });

            console.log("Animation app initialized successfully");

        } catch (error) {
            console.error("Failed to initialize animation app:", error);
        }
    }

    /**
     * Создает сцену Babylon.js
     * @returns {BABYLON.Scene} Созданная сцена
     */
    createScene() {
        const scene = new BABYLON.Scene(this.engine);
        scene.clearColor = BABYLON.Color4.FromColor3(
            BABYLON.Color3.FromInts(
                AnimationConfig.scene.clearColor.r * 255,
                AnimationConfig.scene.clearColor.g * 255,
                AnimationConfig.scene.clearColor.b * 255
            )
        );

        // Создаем камеру
        const camera = new BABYLON.ArcRotateCamera(
            "camera",
            -Math.PI / 2,
            Math.PI / 2.5,
            5,
            new BABYLON.Vector3(0, 1, 0),
            scene
        );
        camera.attachControls(this.canvas, true);

        // Создаем освещение
        const light = new BABYLON.HemisphericLight(
            "light",
            new BABYLON.Vector3(
                AnimationConfig.light.position.x,
                AnimationConfig.light.position.y,
                AnimationConfig.light.position.z
            ),
            scene
        );
        light.intensity = AnimationConfig.light.intensity;

        return scene;
    }

    /**
     * Настраивает пользовательский интерфейс
     */
    setupUI() {
        // Кнопка анимации ходьбы
        document.getElementById('walkButton').addEventListener('click', () => {
            this.animationFacade.playAnimation('walk');
        });

        // Кнопка анимации покоя
        document.getElementById('idleButton').addEventListener('click', () => {
            this.animationFacade.playAnimation('idle');
        });

        // Кнопка остановки всех анимаций
        document.getElementById('stopButton').addEventListener('click', () => {
            this.animationFacade.stopAllAnimations();
        });

        // Показываем доступные анимации в консоли
        const animationNames = this.animationLoader.getAnimationNames();
        console.log("Available animations:", animationNames);
        
        // Создаем кнопки для всех доступных анимаций
        this.createAnimationButtons(animationNames);
    }

    /**
     * Создает кнопки для всех доступных анимаций
     * @param {Array} animationNames - Массив имен анимаций
     */
    createAnimationButtons(animationNames) {
        const uiContainer = document.getElementById('uiContainer');
        const buttonContainer = document.createElement('div');
        
        animationNames.forEach(animName => {
            const button = document.createElement('button');
            button.className = 'control-button';
            button.textContent = animName.charAt(0).toUpperCase() + animName.slice(1);
            button.addEventListener('click', () => {
                this.animationFacade.playAnimation(animName);
            });
            buttonContainer.appendChild(button);
        });
        
        uiContainer.appendChild(buttonContainer);
    }

    /**
     * Очищает ресурсы приложения
     */
    dispose() {
        if (this.animationFacade) {
            this.animationFacade.dispose();
        }
        if (this.scene) {
            this.scene.dispose();
        }
        if (this.engine) {
            this.engine.dispose();
        }
    }
}

// Инициализация приложения когда DOM загружен
document.addEventListener('DOMContentLoaded', () => {
    new AnimationApp();
});
