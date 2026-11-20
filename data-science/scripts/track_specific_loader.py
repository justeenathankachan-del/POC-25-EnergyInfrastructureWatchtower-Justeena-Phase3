import importlib.util
from pathlib import Path

def load_track_module():
    path = Path(__file__).resolve().parent / "track-specific" / "comparative_intelligence.py"
    spec = importlib.util.spec_from_file_location("comparative_intelligence", path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod
