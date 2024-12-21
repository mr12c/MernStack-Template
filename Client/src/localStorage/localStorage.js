 

export function saveState(state) {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem('reduxState', serializedState);
    } catch (error) {
      console.error('Could not save state', error);
    }
  }
  
  export function loadState() {
    try {
      const serializedState = localStorage.getItem('reduxState');
      if (serializedState === null) {
        return undefined;
      }
      return JSON.parse(serializedState);
    } catch (error) {
      console.error('Could not load state', error);
      return undefined;
    }
  }