function newUUID() {
  // Define las longitudes de las secciones del UUID.
  // 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
  const sections = [8, 4, 4, 4, 12];
  let uuid = '';
  
  for (let i = 0; i < sections.length; i++) {
    uuid += newSection(sections[i]);
    // Si no es la última sección, añade un guion.
    if (i < sections.length - 1) {
      uuid += '-';
    }
  }
  
  return uuid;
}

function newSection(longitud) {
  const characters = '0123456789abcdef';
  let section = '';
  
  // Añade un carácter aleatorio a la sección.
  for (let i = 0; i < longitud; i++) {
    section += characters
      .charAt(
        Math.floor(
          Math.random() * characters.length
        ));
  }
  
  return section;
}

module.exports = {
  newUUID
}
