# Documentación de webpay

1. Se importó la librería de transbank-sdk para la api.
2. Se configuraron las transacciones de webpay para un ambiente de integración únicamente (no se usan tarjetas reales).
3. Se creó un endpoint para crear la transacción con webpay y se guardó la información en la base de datos. Además, se devuelve el token y url de la transacción, los que son necesarios para el frontend. Aquí se utilizó una API para convertir el precio desde USD a CLP, pues esta última es la moneda usada en webpay.
4. Se agregó un botón para iniciar la compra con webpay, el cual conecta con el endpoint anterior y reenvia a una pestaña de confirmación de la compra.
5. Al confirmar la compra con un botón en el frontend, se redirige a webpay utilizando el token y url obtenidos desde el backend. Esto mediante un form oculto.
6. Aquí el usuario debe ingresar sus datos en la página de webpay para realizar la compra. De aquí pueden salir 3 posibles resultados, que se cancele la compra, que se finalice con éxito o que se finalice y sea rechazada.
7. Al finalizar el proceso, webpay redirige al url de finalización de compra, que se le fue entregado anteriormente, el cual en nuestro caso nos lleva a una nueva pestaña donde se entrega la información final de la transacción. Aquí se realiza un post a un nuevo endpoint que confirma la información de la compra, la cual seguirá una de los 3 posibles resultados mencionados anteriormente. Dependiendo del resultado, se almacena el status de la transacción en la base de datos, y le entrega el resultado al frontend. Además, se envía una request al broker para que valide la compra.
8. Con la información obtenida de la API, se despliega el resultado de la transacción para que lo pueda ver el cliente.
9. FIN :)