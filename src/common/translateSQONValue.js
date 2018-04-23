export default ({ sets = [], defaultSetText = 'Saved Manifest' }) => value => {
  if (value.includes('set_id:')) {
    const setId = value.replace('set_id:', '');
    const set = sets.find(x => x.setId === setId);
    return (set || {}).name || defaultSetText;
  }
  return value;
};
