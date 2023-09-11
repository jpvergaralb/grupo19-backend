function newUUID() {
  const sections = [8, 4, 4, 4, 12];
  let uuid = '';
  
  for (let i = 0; i < sections.length; i++) {
    uuid += newSection(sections[i]);
    if (i < sections.length - 1) {
      uuid += '-';
    }
  }
  
  return uuid;
}

function newSection(longitud) {
  const characters = '0123456789abcdef';
  let section = '';
  
  for (let i = 0; i < longitud; i++) {
    section += characters
      .charAt(
        Math.floor(
          Math.random() * characters.length
        ));
  }
  
  return section;
}

// Ejemplo de uso:
const uuidGenerado = newUUID();
console.log(uuidGenerado);

module.exports = {
  newUUID
}
