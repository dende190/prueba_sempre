const funciones = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.crearUsuario = funciones.https.onCall((datos, contexto) => {
  return admin.firestore().collection('users').add({
    name: datos.nombre,
    email: datos.correo,
    password: datos.contrasena,
  });
});

exports.editarUsuario = funciones.https.onCall((datos, contexto) => {
  return admin.firestore().collection('users').doc(datos.id).set(
    {
      name: datos.nombre,
      email: datos.correo,
      password: datos.contrasena,
    },
    {
      merge: true,
    }
  );
});

exports.borrarUsuario = funciones.https.onCall((datos, contexto) => {
  const usuario = (
    admin.firestore().collection('users').doc(datos.id)
  );
  return usuario.delete();
});

exports.agregarPuntos = funciones.https.onCall((datos, contexto) => {
  return (
    admin
      .firestore()
      .collection('users')
      .doc(datos.idUsuario)
      .collection('points')
      .add({
        quantity: datos.cantidad,
        reason: datos.razon,
      })
  );
});

exports.borrarPunto = funciones.https.onCall((datos, contexto) => {
  const usuario = (
    admin
      .firestore()
      .collection('users')
      .doc(datos.idUsuario)
      .collection('points')
      .doc(datos.idPunto)
  );
  return usuario.delete();
});

exports.editarPunto = funciones.https.onCall((datos, contexto) => {
  return (
    admin
      .firestore()
      .collection('users')
      .doc(datos.idUsuario)
      .collection('points')
      .doc(datos.idPunto)
      .set(
        {
          quantity: datos.cantidad,
          reason: datos.razon,
        },
        {
          merge: true,
        }
      )
  );
});
