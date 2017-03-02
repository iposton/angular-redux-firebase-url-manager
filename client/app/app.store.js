class Store {

  constructor(reducer, initializeState) {
    this.reducer = reducer;
    this.state = initializeState;
    this.listeners = [];
  }

  getState() {
    return this.state;
  }

  dispatch(action) {
    this.state = this.reducer(this.state, action);
    this.listeners.forEach(listener => listener());
  }

  subscribe(listener) {
    this.listeners = [...this.listeners, listener]

     // return an unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    }
  }


}

export default Store;