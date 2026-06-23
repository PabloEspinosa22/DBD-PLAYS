import cv2
import numpy as np
import os

# 1. Definición de la función (se usan variables genéricas aquí)
def mejorar_render_juego(ruta_origen, ruta_destino):
    # Leer la imagen original
    img = cv2.imread(ruta_origen)
    if img is None:
        print(f"Error: No se pudo leer {ruta_origen}")
        return

    # Redimensionar al doble usando interpolación Lanczos
    alto, ancho = img.shape[:2]
    img_grande = cv2.resize(img, (ancho * 2, alto * 2), interpolation=cv2.INTER_LANCZOS4)

    # Convertir a espacio de color LAB para mejorar el contraste adaptativo
    lab = cv2.cvtColor(img_grande, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    
    clahe = cv2.createCLAHE(clipLimit=2.5, tileGridSize=(8, 8))
    cl = clahe.apply(l)
    
    img_contraste = cv2.merge((cl, a, b))
    img_mejorada = cv2.cvtColor(img_contraste, cv2.COLOR_LAB2BGR)

    # Aplicar un kernel de enfoque sutil (Sharpening)
    kernel = np.array([[ 0, -1,  0],
                       [-1,  5, -1],
                       [ 0, -1,  0]])
    resultado_final = cv2.filter2D(img_mejorada, -1, kernel)

    # Guardar el archivo optimizado
    cv2.imwrite(ruta_destino, resultado_final)
    print(f"Mejorada con éxito: {os.path.basename(ruta_destino)}")


# 2. Ejecución del código (Aquí pones tus rutas reales)
# Usamos 'r' antes de las comillas para que Windows lea bien las barras invertidas
carpeta_origen = r"C:\Users\USER\dbd-hangman\public\img"
carpeta_destino = r"C:\Users\USER\dbd-hangman\public\img_mejoradas"

# Si la carpeta de destino no existe, Python la crea por ti
if not os.path.exists(carpeta_destino):
    os.makedirs(carpeta_destino)

print("Iniciando el procesamiento de imágenes...")

# Recorrer todos los archivos de tu carpeta original
for archivo in os.listdir(carpeta_origen):
    # Asegurarnos de que solo procese imágenes y no otros archivos
    if archivo.endswith((".png", ".jpg", ".jpeg")):
        # Unir la ruta de la carpeta con el nombre del archivo
        ruta_in = os.path.join(carpeta_origen, archivo)
        ruta_out = os.path.join(carpeta_destino, archivo)
        
        # Llamar a la función
        mejorar_render_juego(ruta_in, ruta_out)

print("¡Proceso terminado exitosamente!")