module.exports = {
  // ... other config
  theme: {
    extend: {
      // ... other extensions
      keyframes: {
        'slide-in-left': {
          '0%': { 
            transform: 'translateX(100%)',
            opacity: '0'
          },
          '100%': { 
            transform: 'translateX(0)',
            opacity: '1'
          }
        }
      },
      animation: {
        'slide-in-left': 'slide-in-left 0.5s ease-out'
      }
    }
  }
}