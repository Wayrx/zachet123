/**
 * Фасад для упрощения работы с анимациями
 * Предоставляет простой интерфейс для сложной системы анимаций
 */
class AnimationFacade {
    constructor(animationLoader, config) {
        this.animationLoader = animationLoader;
        this.config = config;
        this.currentAnimation = null;
        this.isShiftPressed = false;
        this.currentSpeed = config.speeds.normal;
        
        // Инициализируем обработчики событий
        this.initEventHandlers();
    }

    /**
     * Инициализирует обработчики событий клавиатуры
     */
    initEventHandlers() {
        // Обработчик нажатия клавиш
        this.onKeyDown = (event) => {
            if (event.key === 'Shift') {
                this.isShiftPressed = true;
                this.updateAnimationSpeed();
            }
        };

        this.onKeyUp = (event) => {
            if (event.key === 'Shift') {
                this.isShiftPressed = false;
                this.updateAnimationSpeed();
            }
        };

        // Добавляем обработчики на документ
        document.addEventListener('keydown', this.onKeyDown);
        document.addEventListener('keyup', this.onKeyUp);
    }

    /**
     * Обновляет скорость анимации в зависимости от состояния Shift
     */
    updateAnimationSpeed() {
        const targetSpeed = this.isShiftPressed ? 
            this.config.speeds.slow : 
            this.getCurrentAnimationSpeed();
        
        this.setAnimationSpeed(targetSpeed);
    }

    /**
     * Получает базовую скорость для текущей анимации
     * @returns {number} Базовая скорость
     */
    getCurrentAnimationSpeed() {
        switch (this.currentAnimation) {
            case 'walk': return this.config.speeds.walk;
            case 'idle': return this.config.speeds.idle;
            default: return this.config.speeds.normal;
        }
    }

    /**
     * Устанавливает скорость текущей анимации
     * @param {number} speed - Скорость анимации
     */
    setAnimationSpeed(speed) {
        this.currentSpeed = speed;
        
        if (this.currentAnimation) {
            const animationData = this.animationLoader.getAnimation(this.currentAnimation);
            if (animationData && animationData.animatable) {
                animationData.animatable.speedRatio = speed;
            }
        }
        
        // Обновляем UI
        this.updateSpeedInfo();
    }

    /**
     * Запускает анимацию с плавным переходом
     * @param {string} animationName - Имя анимации
     * @param {number} transitionDuration - Длительность перехода
     */
    playAnimation(animationName, transitionDuration = null) {
        const duration = transitionDuration || this.config.transitions.duration;
        
        console.log(`Playing animation: ${animationName} with transition: ${duration}s`);
        
        // Плавный переход через изменение веса анимации
        this.crossFadeToAnimation(animationName, duration);
        
        this.currentAnimation = animationName;
        this.updateAnimationSpeed();
        this.updateAnimationInfo();
    }

    /**
     * Плавный переход между анимациями
     * @param {string} targetAnimation - Целевая анимация
     * @param {number} duration - Длительность перехода
     */
    crossFadeToAnimation(targetAnimation, duration) {
        // В реальном проекте здесь была бы реализация cross-fade
        // Для простоты используем immediate transition
        this.animationLoader.beginAnimation(
            targetAnimation, 
            true, 
            this.currentSpeed
        );
    }

    /**
     * Останавливает все анимации
     */
    stopAllAnimations() {
        this.animationLoader.
        stopAllAnimations();
        this.currentAnimation = null;
        this.updateAnimationInfo();
    }

    /**
     * Обновляет информацию о скорости в UI
     */
    updateSpeedInfo() {
        const speedInfo = document.getElementById('speedInfo');
        if (speedInfo) {
            speedInfo.textContent = `Current Speed: ${this.currentSpeed.toFixed(1)}x`;
        }
    }

    /**
     * Обновляет информацию о текущей анимации в UI
     */
    updateAnimationInfo() {
        const animationInfo = document.getElementById('animationInfo');
        if (animationInfo) {
            animationInfo.textContent = `Current Animation: ${this.currentAnimation || 'None'}`;
        }
    }

    /**
     * Очищает ресурсы
     */
    dispose() {
        document.removeEventListener('keydown', this.onKeyDown);
        document.removeEventListener('keyup', this.onKeyUp);
    }
}
