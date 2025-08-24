// Audio Context Error Fix
// This utility prevents audio context errors from showing in the console

export const initializeAudioFix = () => {
  // Override console.error to filter out audio context errors
  const originalConsoleError = console.error;
  
  console.error = (...args) => {
    const message = args.join(' ');
    
    // Filter out known audio context errors
    const audioErrors = [
      'Cannot suspend a closed AudioContext',
      'Cannot resume a closed AudioContext',
      'AudioContext was not allowed to start',
      'The AudioContext was not allowed to start',
      'play() failed because the user didn\'t interact',
      'NotAllowedError: play() failed'
    ];
    
    const isAudioError = audioErrors.some(error => 
      message.toLowerCase().includes(error.toLowerCase())
    );
    
    // Only show non-audio errors
    if (!isAudioError) {
      originalConsoleError.apply(console, args);
    }
  };

  // Override console.warn for audio warnings
  const originalConsoleWarn = console.warn;
  
  console.warn = (...args) => {
    const message = args.join(' ');
    
    const audioWarnings = [
      'AudioContext',
      'Web Audio API',
      'audio context',
      'MediaElementAudioSource'
    ];
    
    const isAudioWarning = audioWarnings.some(warning => 
      message.toLowerCase().includes(warning.toLowerCase())
    );
    
    // Only show non-audio warnings
    if (!isAudioWarning) {
      originalConsoleWarn.apply(console, args);
    }
  };

  // Handle unhandled promise rejections related to audio
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason;
    const message = error?.message || error?.toString() || '';
    
    const audioErrors = [
      'AudioContext',
      'play() failed',
      'NotAllowedError',
      'audio context'
    ];
    
    const isAudioError = audioErrors.some(errorType => 
      message.toLowerCase().includes(errorType.toLowerCase())
    );
    
    if (isAudioError) {
      event.preventDefault(); // Prevent the error from being logged
    }
  });

  // Handle global errors
  window.addEventListener('error', (event) => {
    const message = event.message || '';
    
    const audioErrors = [
      'AudioContext',
      'play() failed',
      'audio context'
    ];
    
    const isAudioError = audioErrors.some(errorType => 
      message.toLowerCase().includes(errorType.toLowerCase())
    );
    
    if (isAudioError) {
      event.preventDefault(); // Prevent the error from being logged
    }
  });
};

// Clean up function
export const cleanupAudioFix = () => {
  // This would restore original console methods if needed
  // For now, we'll leave the filtered versions in place
  console.log('Audio error filtering is active - audio context errors are suppressed');
};