import numpy as np

from logs import print


def linear_regression(x: np.ndarray, y: np.ndarray) -> tuple[float, float]:
    """
    --- Documentación por ChatGPT ---
    Realiza una regresión lineal simple sobre los datos proporcionados.

    Params
    ----------
    :param x: numpy.ndarray
        Variable independiente, que en este contexto representa típicamente
        el tiempo.
    :param y : numpy.ndarray
        Variable dependiente, que representa los precios de las acciones en
        este contexto.

    :return tuple[float, float]:
    -------
    float
        La pendiente (m) de la línea de regresión.
    float
        La ordenada al origen (b) de la línea de regresión.

    Notas
    -----
    La línea de regresión se calcula utilizando la fórmula:
        y = mx + b
    Donde:
        m = (Σ(xi - x̄)(yi - ȳ)) / Σ(xi - x̄)^2
        b = ȳ - m * x̄
    Aquí, x̄ es la media de los valores x y ȳ es la media de los valores y.

    Ejemplo
    -------
    >>> x_array = np.array([1, 2, 3, 4, 5])
    >>> y_array = np.array([2, 4, 5, 4, 5])
    >>> m, b = linear_regression(x, y)
    >>> print(f"y = {m:.2f}x + {b:.2f}")
    y = 0.60x + 2.20
    """
    x_mean: np.float64 = np.mean(x)
    y_mean: np.float64 = np.mean(y)

    numerator: float = sum((x - float(x_mean)) * (y - float(y_mean)))
    denominator: float = sum((x - float(x_mean)) ** 2)

    slope: float = numerator / denominator
    base: float = y_mean - slope * x_mean

    return slope, base


def predict_stock_value(data: dict[int, float], moment_epoch: int) -> float:
    """
    --- Documentación por ChatGPT ---
    Predice el valor de las acciones para un momento específico utilizando
    regresión lineal.

    Params
    ----------
    :param data: dict[int, float]
        Diccionario que contiene los valores de las acciones (valores) y sus
        respectivos tiempos en formato epoch (claves).
    :param moment_epoch: int
        El tiempo específico en formato epoch para el cual se quiere predecir
        el valor de las acciones.

    :return: float
    -------
        El valor predicho de las acciones para el momento especificado.

    Notas
    -----
    Esta función utiliza la regresión lineal para predecir el valor de las
    acciones. La precisión de la predicción
    puede variar dependiendo de la naturaleza y tendencia de los datos.

    Ejemplo
    -------
    >>> stocks_data = {
    ...     1680969060: 5,
    ...     1680969360: 7,
    ...     1680969660: 546,
    ...     1680969960: 115,
    ...     1680970260: 41
    ... }
    >>> epoch_moment = 1680970000
    >>> predicted_value = predict_stock_value(stocks_data, epoch_moment)
    >>> print(f"El valor predicho es: {predicted_value:.2f}")
    El valor predicho es: 123.45 # Este es solo un valor ilustrativo, no es
    el resultado real.
    """
    x = np.array(list(data.keys()))
    y = np.array(list(data.values()))

    m, b = linear_regression(x, y)

    return m * moment_epoch + b
