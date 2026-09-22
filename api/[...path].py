import sys
from pathlib import Path

application_dir = Path(__file__).resolve().parents[1] / "application"
sys.path.insert(0, str(application_dir))

from main import app
