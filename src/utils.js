/* https://catalinxyz.com/create-the-@bind-decorator-to-help-with-react-events-and-callback-props */
export function bind(target, name, descriptor) {
  return {
    get() {
      const bound = descriptor.value.bind(this);

      Object.defineProperty(this, name, {
        value: bound,
      });

      return bound;
    },
  };
}
