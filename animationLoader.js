/**
 * Класс для загрузки анимаций (SRP - Single Responsibility Principle)
 * Отвечает только за загрузку и управление ресурсами анимаций
 */
class AnimationLoader {
    constructor(scene) {
        this.scene = scene;
        this.animations = new Map();
        this.skeleton = null;
        this.mesh = null;
    }

    /**
     * Загружает модель со скелетом и анимациями
     * @param {string} url - URL модели
     * @returns {Promise} Промис с загруженными данными
     */
    async loadModel(url) {
        try {
            console.log("Loading model from:", url);
            
            const result = await BABYLON.SceneLoader.ImportMeshAsync(
                "", 
                url, 
                "", 
                this.scene
            );
            this.mesh = result.meshes[0];
            this.skeleton = this.mesh.skeleton;

            if (!this.skeleton) {
                throw new Error("No skeleton found in the model");
            }

            console.log("Model loaded successfully:", this.mesh.name);
            console.log("Skeleton bones:", this.skeleton.bones.length);
            console.log("Available animations:", this.skeleton.getAnimatables());

            // Извлекаем все анимации из скелета
            this.extractAnimations();
            
            return {
                mesh: this.mesh,
                skeleton: this.skeleton,
                animations: this.animations
            };
        } catch (error) {
            console.error("Error loading model:", error);
            throw error;
        }
    }

    /**
     * Извлекает анимации из скелета и сохраняет их для дальнейшего использования
     */
    extractAnimations() {
        if (!this.skeleton) return;

        // Получаем все анимации из скелета
        const animatables = this.skeleton.getAnimatables();
        
        animatables.forEach((animatable, index) => {
            const anims = animatable.animations;
            if (anims && anims.length > 0) {
                anims.forEach(animation => {
                    // Используем имя анимации или создаем дефолтное
                    const animName = animation.name || `animation_${index}`;
                    this.animations.set(animName, {
                        animatable: animatable,
                        animation: animation
                    });
                    console.log(`Found animation: ${animName}`);
                });
            }
        });

        // Если анимации не найдены в скелете, создаем дефолтные
        if (this.animations.size === 0) {
            console.warn("No animations found in skeleton, creating default animations");
            this.createDefaultAnimations();
        }
    }

    /**
     * Создает дефолтные анимации если модель не содержит анимаций
     */
    createDefaultAnimations() {
        // Создаем простую анимацию для демонстрации
        const walkAnimation = new BABYLON.Animation(
            "walk",
            "position.y",
            30,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
        );

        const keys = [];
        keys.push({ frame: 0, value: 0 });
        keys.push({ frame: 15, value: 0.5 });
        keys.push({ frame: 30, value: 0 });
        walkAnimation.setKeys(keys);

        this.mesh.animations = [walkAnimation];
        const animatable = this.scene.beginAnimation(this.mesh, 0, 30, true);
        
        this.animations.set("walk", {
            animatable: animatable,
            animation: walkAnimation
        });

        this.stopAllAnimations();
    }

    /**
     * Получает анимацию по имени
     * @param {string} name - Имя анимации
     * @returns {Object} Данные анимации
     */
    getAnimation(name) {
        return this.animations.get(name);
    }

    /**
     * Получает все доступные имена анимаций
     * @returns {Array} Массив имен анимаций
     */
    getAnimationNames() {
        return Array.from(this.animations.keys());
    }

    /**
     * Останавливает все текущие анимации
     */
    stopAllAnimations() {
        this.animations.forEach((data, name) => {
            if (data.animatable) {
                data.animatable.stop();
            }
        });
        this.scene.stopAnimation(this.mesh);
    }

    /**
     * Начинает воспроизведение анимации
     * @param {string} animationName - Имя анимации
     * @param {boolean} loop - Зациклить анимацию
     * @param {number} speedRatio - Скорость воспроизведения
     * @returns {BABYLON.Animatable} Объект анимации
     */
    beginAnimation(animationName, loop = true, speedRatio = 1.0) {
        this.stopAllAnimations();

        const animationData = this.animations.get(animationName);
        if (animationData && animationData.animatable) {
            // Перезапускаем анимацию
            const newAnimatable = this.scene.beginAnimation(
                animationData.animatable.target, 
                0, 
                100, 
                loop, 
                speedRatio
            );
            
            // Обновляем ссылку на animatable
            animationData.animatable = newAnimatable;
            return newAnimatable;
        }

        return null;
    }
}
