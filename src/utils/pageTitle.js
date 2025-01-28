export function getPageTitle(routePath) {
  if (!routePath) {
    return '';
  }
  const parts = routePath.split('/');
  const fileNameWithExtension = parts[parts.length - 1];
  if (!fileNameWithExtension) {
      return '';
  }
  const fileNameWithoutExtension = fileNameWithExtension.split('.')[0];
  const formattedName = fileNameWithoutExtension.replace(/([A-Z])/g, ' $1').trim();
    return formattedName.charAt(0).toUpperCase() + formattedName.slice(1);
}

