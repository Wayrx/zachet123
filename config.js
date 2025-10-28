/**
 * Конфигурационный файл для настроек анимации (DIP - Dependency Inversion Principle)
 * Все настройки вынесены в отдельный объект для легкого изменения поведения
 */
const AnimationConfig = {
    // Скорости анимаций
    speeds: {
        normal: 1.0,
        slow: 0.3,    // скорость при удерживании Shift
        walk: 1.0,
        idle: 0.8
    },
    
    // Настройки переходов между анимациями
    transitions: {
        duration: 0.3,  // длительность перехода в секундах
        easing: BABYLON.Animation.EASINGMODE_EASEINOUT
    },
    
    // Настройки модели
    model: {
        url: "https://assets.babylonjs.com/meshes/box_skelly.glb",
        scale: 0.1,
        position: { x: 0, y: 0, z: 0 }
    },
    
    // Настройки сцены
    scene: {
        clearColor: { r: 0.8, g: 0.9, b: 1.0 },
        gravity: { x: 0, y: -0.9, z: 0 }
    },
    
    // Настройки камеры
    camera: {
        position: { x: 0, y: 1, z: -5 },
        target: { x: 0, y: 1, z: 0 }
    },
    
    // Настройки освещения
    light: {
        position: { x: 0, y: 5, z: -5 },
        intensity: 1.0
    }
};
