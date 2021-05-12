'use strict';

let dContenedorListaUsuarios = document.querySelector(
  '.contenido_lista-usuarios'
);
let dContenedorCrearUsuario = document.querySelector(
  '.contenido_crear-usuario'
);

function cambiarListaUsuarios() {
  dContenedorCrearUsuario.classList.add('ocultar');
  dContenedorListaUsuarios.classList.remove('ocultar');
}

document.querySelector('.jsListaUsuarios').addEventListener(
  'click',
  cambiarListaUsuarios
);

document.querySelector('.jsCrearUsuario').addEventListener('click', () => {
  dContenedorListaUsuarios.classList.add('ocultar');
  dContenedorCrearUsuario.classList.remove('ocultar');
});
