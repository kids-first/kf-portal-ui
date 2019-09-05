const registry = {};

/**
 * Registers a popup for later use using the `GlobalModal` component.
 * @param {String} modalName - the name of the popup to register.
 * @param {Class} Component - the component's class or function.
 */
export const registerModal = (modalName, Component = null) => {
  registry[modalName] = Component;
};

/**
 * Get a popup ComponentClass by it's name.
 * @param {String} modalName - the name of the popup Component to get.
 * @returns A ComponentClass for that popup.
 */
export const getModal = modalName => {
  return (modalName && registry[modalName]) || null;
};
