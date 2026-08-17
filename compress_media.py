import os
from PIL import Image
import re

PHOTO_DIR = 'Photo'
MAX_WIDTH = 1080

def compress_photos():
    if not os.path.exists(PHOTO_DIR):
        print(f"Directory {PHOTO_DIR} not found.")
        return

    print("Compressing photos...")
    for filename in os.listdir(PHOTO_DIR):
        if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            filepath = os.path.join(PHOTO_DIR, filename)
            try:
                img = Image.open(filepath)
                
                # Check if it has EXIF data (orientation) and apply it so image doesn't rotate
                from PIL import ImageOps
                img = ImageOps.exif_transpose(img)

                # Resize if wider than MAX_WIDTH
                if img.width > MAX_WIDTH:
                    ratio = MAX_WIDTH / float(img.width)
                    new_height = int(float(img.height) * float(ratio))
                    img = img.resize((MAX_WIDTH, new_height), Image.Resampling.LANCZOS)
                
                # Convert to RGB if it's RGBA (PNG with transparency) to save as JPG
                if img.mode in ("RGBA", "P"):
                    img = img.convert("RGB")
                
                # Save optimized
                img.save(filepath, 'JPEG', quality=85, optimize=True)
                print(f"Compressed: {filename}")
            except Exception as e:
                print(f"Error compressing {filename}: {e}")

def add_lazy_loading():
    print("Adding loading='lazy' to images in index.html...")
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Simple regex to add loading="lazy" if not present
    def replace_img(match):
        img_tag = match.group(0)
        if 'loading="lazy"' not in img_tag:
            # Add it before the closing >
            return img_tag[:-1] + ' loading="lazy">'
        return img_tag

    new_html = re.sub(r'<img[^>]+>', replace_img, html)
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(new_html)
    print("Done updating index.html")

if __name__ == '__main__':
    compress_photos()
    add_lazy_loading()
