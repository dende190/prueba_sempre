'use strict';

let dCargando = document.querySelector('.cargando');
function cargando(prender) {
  if (prender) {
    dCargando.style.display = 'flex';
    return;
  }

  dCargando.style.display = 'none';
}

function borrarUsuario() {
  cargando(true);
  const borrarUsuario = firebase.functions().httpsCallable('borrarUsuario');
  borrarUsuario({
    id: this.dataset.id,
  }).then(resultado => {
    (
      document
      .querySelector('li[data-id="' + this.dataset.id + '"]')
      .remove()
    );
    cargando(false);
  }).catch(error => {
    console.log('no se pudo borrar');
    cargando(false);
  });
}

function editarUsuario(evento) {
  cargando(true);
  evento.preventDefault();
  const editarUsuario = firebase.functions().httpsCallable('editarUsuario');
  editarUsuario({
    id: evento.target.identificador.value,
    correo: evento.target.correo.value,
    nombre: evento.target.nombre.value,
    contrasena: evento.target.contrasena.value,
  }).then(resultado => {
    (
      document
      .querySelector(
        'li[data-id="' + evento.target.identificador.value + '"] ' +
        '.contenedor_usuario'
      )
      .classList
      .remove('ocultar')
    );
    (
      document
      .querySelector(
        'li[data-id="' + evento.target.identificador.value + '"] ' +
        '.contenedor_edicion'
      )
      .classList
      .add('ocultar')
    );
    cargando(false);
  }).catch(error => {
    console.log(
      'Ocurrio un error al editar el usuario, por favor intentelo de nuevo'
    );
    cargando(false);
  });
}

function abrirEdicionUsuario() {
  (
    document
    .querySelector('li[data-id="' + this.dataset.id + '"] .contenedor_usuario')
    .classList
    .add('ocultar')
  );
  (
    document
    .querySelector('li[data-id="' + this.dataset.id + '"] .contenedor_edicion')
    .classList
    .remove('ocultar')
  );
}

function cerrarModalPuntos() {
  document.querySelector('.modalPuntos').classList.add('ocultar');
}

function abrirModalPuntos() {
  cargando(true);
  const coleccionPoints = (
    firebase
    .firestore()
    .collection('users')
    .doc(this.dataset.id)
    .collection('points')
  );
  coleccionPoints.onSnapshot(coleccion => {
    let listaPuntos = [];
    coleccion.forEach(puntos => {
      listaPuntos.push({...puntos.data(), id: puntos.id});
    });

    let html = '';
    listaPuntos.forEach(punto => {
      html += (
        '<li data-punto-id="' + punto.id + '">' +
          '<div class="contenedor_punto">' +
            '<p>' +
              '<strong>Cantidad:</strong> ' + punto.quantity +
            '</p>' +
            '<p>' +
              '<strong>Razon:</strong> ' + punto.reason +
            '</p>' +
            '<button ' +
              'class="jsEditarPunto" ' +
              'data-usuario-id="' + this.dataset.id + '" ' +
              'data-punto-id="' + punto.id + '" ' +
            '>' +
              'Editar' +
            '</button>' +
            '<button ' +
              'class="jsBorrarPunto" ' +
              'data-usuario-id="' + this.dataset.id + '" ' +
              'data-punto-id="' + punto.id + '" ' +
            '>' +
              'Borrar' +
            '</button>' +
          '</div>' +
          '<div class="contenedor_edicion-punto ocultar">' +
            '<form class="formulario jsFormularioEditarPunto">' +
              '<input ' +
                'type="number" ' +
                'name="cantidad" ' +
                'placeholder="Cantidad" ' +
                'value="' + punto.quantity + '"' +
              '/>' +
              '<input ' +
                'type="text" ' +
                'name="razon" ' +
                'placeholder="Razon" ' +
                'value="' + punto.reason + '"' +
              '/>' +
              '<input ' +
                'type="hidden" ' +
                'name="identificadorUsuario" ' +
                'value="' + this.dataset.id + '"' +
              '/>' +
              '<input ' +
                'type="hidden" ' +
                'name="identificadorPunto" ' +
                'value="' + punto.id + '"' +
              '/>' +
              '<button>Guardar</button>' +
            '</form>' +
          '</div>' +
        '</li>'
      );
    });

    document.querySelector('.contenedor_puntos').innerHTML = html;
    document.querySelector('.jsFormularioPuntos .jsIdentificador').value = (
      this.dataset.id
    );
    document.querySelector('.modalPuntos').classList.remove('ocultar');
    document.querySelectorAll('.jsBorrarPunto').forEach(borrarPunto => {
      borrarPunto.addEventListener('click', borrarPunto);
    });
    document.querySelectorAll('.jsEditarPunto').forEach(editarPunto => {
      editarPunto.addEventListener('click', abrirEdicionPunto);
    });
    document.querySelectorAll('.jsFormularioEditarPunto').forEach(
      formularioEditarPunto => {
        formularioEditarPunto.addEventListener(
          'submit',
          editarPunto
        );
      }
    );
    cargando(false);
  });
}

function guardarPuntos(evento) {
  cargando(true);
  evento.preventDefault();
  const agregarPuntos = firebase.functions().httpsCallable('agregarPuntos');
  agregarPuntos({
    cantidad: evento.target.cantidad.value,
    razon: evento.target.razon.value,
    idUsuario: evento.target.identificadorUsuario.value,
  }).then(resultado => {
    evento.target.reset();
    document.querySelector('.modalPuntos').classList.add('ocultar');
    cerrarModalPuntos();
    cargando(false);
  }).catch(error => {
    console.log('No se guardaron los puntos');
    cargando(false);
  });
}

function borrarPunto() {
  cargando(true);
  const borrarPunto = firebase.functions().httpsCallable('borrarPunto');
  borrarPunto({
    idUsuario: this.dataset.usuarioId,
    idPunto: this.dataset.puntoId,
  }).then(resultado => {
    (
      document
      .querySelector('li[data-punto-id="' + this.dataset.puntoId + '"]')
      .remove()
    );
    cerrarModalPuntos();
    cargando(false);
  }).catch(error => {
    console.log('no se pudo borrar');
    cargando(false);
  });
}

function abrirEdicionPunto() {
  (
    document
    .querySelector(
      'li[data-punto-id="' + this.dataset.puntoId + '"] .contenedor_punto'
    )
    .classList
    .add('ocultar')
  );
  (
    document
    .querySelector(
      'li[data-punto-id="' + this.dataset.puntoId + '"] ' +
      '.contenedor_edicion-punto'
    )
    .classList
    .remove('ocultar')
  );
}

function editarPunto(evento) {
  cargando(true);
  evento.preventDefault();
  const editarPunto = firebase.functions().httpsCallable('editarPunto');
  editarPunto({
    idUsuario: evento.target.identificadorUsuario.value,
    idPunto: evento.target.identificadorPunto.value,
    cantidad: evento.target.cantidad.value,
    razon: evento.target.razon.value,
  }).then(resultado => {
    (
      document
      .querySelector(
        'li[data-punto-id="' + this.dataset.puntoId + '"] .contenedor_punto'
      )
      .classList
      .remove('ocultar')
    );
    (
      document
      .querySelector(
        'li[data-punto-id="' + this.dataset.puntoId + '"] ' +
        '.contenedor_edicion-punto'
      )
      .classList
      .add('ocultar')
    );
    cerrarModalPuntos();
    cargando(false);
  }).catch(error => {
    console.log(
      'Ocurrio un error al editar el punto, por favor intentelo de nuevo'
    );
    cargando(false);
  });
}

const coleccionUsers = firebase.firestore().collection('users');

coleccionUsers.onSnapshot(coleccion => {
  cargando(true);
  let listaUsuarios = [];
  coleccion.forEach(usuario => {
    listaUsuarios.push({...usuario.data(), id: usuario.id});
  });

  if (listaUsuarios.length === 0) {
    document.querySelector('.contenedor_usuarios').innerHTML = (
      '<p>Sin registros</p>'
    );
    cargando(false);
    return;
  }

  let html = '';
  listaUsuarios.forEach(usuario => {
    html += (
      '<li data-id="' + usuario.id + '">' +
        '<div class="contenedor_usuario">' +
          '<p>' + usuario.name + '</p>' +
          '<button class="jsBotonEditar" data-id="' + usuario.id + '">' +
            'Editar' +
          '</button>' +
          '<button ' +
            'class="jsBorrarUsuario" ' +
            'data-id="' + usuario.id + '" ' +
          '>' +
            'Borrar' +
          '</button>' +
          '<button ' +
            'class="jsPuntosUsuario" ' +
            'data-id="' + usuario.id + '" ' +
          '>' +
            'Editar puntos' +
          '</button>' +
        '</div>' +
        '<div class="contenedor_edicion ocultar">' +
          '<form class="formulario jsFormularioEditarUsuario">' +
            '<input ' +
              'type="text" ' +
              'name="nombre" ' +
              'placeholder="nombre usuario" ' +
              'value="' + usuario.name + '"' +
            '/>' +
            '<input ' +
              'type="email" ' +
              'name="correo" ' +
              'placeholder="correo usuario" ' +
              'value="' + usuario.email + '"' +
            '/>' +
            '<input ' +
              'type="password" ' +
              'name="contrasena" ' +
              'placeholder="contrasena usuario" ' +
            '/>' +
            '<input ' +
              'type="hidden" ' +
              'name="identificador" ' +
              'value="' + usuario.id + '"' +
            '/>' +
            '<button>Guardar</button>' +
          '</form>' +
        '</div>' +
      '</li>'
    );
  });

  document.querySelector('.contenedor_usuarios').innerHTML = html;
  document.querySelectorAll('.jsBorrarUsuario').forEach(botonBorrar => {
    botonBorrar.addEventListener(
      'click',
      borrarUsuario
    );
  });
  document.querySelectorAll('.jsFormularioEditarUsuario').forEach(
    formularioEditarUsuario => {
      formularioEditarUsuario.addEventListener(
        'submit',
        editarUsuario
      );
    }
  );
  document.querySelectorAll('.jsBotonEditar').forEach(botonEditar => {
    botonEditar.addEventListener('click', abrirEdicionUsuario);
  });

  document.querySelectorAll('.jsPuntosUsuario').forEach(puntoUsuario => {
    puntoUsuario.addEventListener('click', abrirModalPuntos);
  });
  cargando(false);
});

const dErrorFormularioRegistro = document.querySelector(
  '.jsErrorFormularioRegistro'
);
document.querySelector('.jsFormularioRegistro').addEventListener(
  'submit',
  evento => {
    cargando(true);
    evento.preventDefault();
    const crearUsuario = firebase.functions().httpsCallable('crearUsuario');
    crearUsuario({
      correo: evento.target.correo.value,
      nombre: evento.target.nombre.value,
      contrasena: evento.target.contrasena.value,
    }).then(resultado => {
      evento.target.reset();
      cambiarListaUsuarios();
      dErrorFormularioRegistro.textContent = '';
      cargando(false);
    }).catch(error => {
      dErrorFormularioRegistro.textContent = (
        'Ocurrio un error al crear el usuario, por favor intentelo de nuevo'
      );
      cargando(false);
    });
  }
);

document.querySelector('.jsFormularioPuntos').addEventListener(
  'submit',
  guardarPuntos
);
