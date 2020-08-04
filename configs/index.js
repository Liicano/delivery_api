const mobileappsettings = require('./mobileappsettings.json')

const mobileAppClientSettings = {
    success: true,
    data: mobileappsettings,
    message: 'Settings retrieved successfully',
}

module.exports = {
    JWT_KEY: 'Delivery.Sophia.Knowledge',
    DEFAULT_PASSWORD: '$3b$13$2/VCepff',
    MOBILEAPPSETTINGS: mobileAppClientSettings,
}
