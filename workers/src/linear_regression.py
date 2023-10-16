import numpy as np
from datetime import datetime


def linear_regression(x, y):
    """
    Realiza una regresión lineal simple sobre los datos proporcionados.

    Parámetros
    ----------
    x : numpy.array
        Variable independiente, que en este contexto representa típicamente
        el tiempo.
    y : numpy.array
        Variable dependiente, que representa los precios de las acciones en
        este contexto.

    Devoluciones
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
    >>> x = np.array([1, 2, 3, 4, 5])
    >>> y = np.array([2, 4, 5, 4, 5])
    >>> m, b = linear_regression(x, y)
    >>> print(f"y = {m:.2f}x + {b:.2f}")
    y = 0.60x + 2.20
    """
    x_mean = np.mean(x)
    y_mean = np.mean(y)

    numerator = sum((x - x_mean) * (y - y_mean))
    denominator = sum((x - x_mean) ** 2)

    m = numerator / denominator
    b = y_mean - m * x_mean

    return m, b
