# -*- coding: utf-8 -*-
import os
import shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def copy_dir(src_rel, dst_rel, count):
    src = os.path.join(ROOT, src_rel)
    dst = os.path.join(ROOT, dst_rel)
    os.makedirs(dst, exist_ok=True)
    files = sorted(os.listdir(src))
    for i in range(count):
        shutil.copy2(os.path.join(src, files[i]), os.path.join(dst, f"{i+1:02d}.png"))


if __name__ == "__main__":
    copy_dir("public/portfolio/kitchen", "portfolio/kitchen", 2)
    copy_dir("public/portfolio/living", "portfolio/living", 2)
    copy_dir("public/portfolio/bedroom", "portfolio/bedroom", 1)
    copy_dir("public/portfolio/bathroom", "portfolio/bathroom", 1)
    copy_dir("public/portfolio/details", "portfolio/details", 1)
    print("copied to portfolio/")
