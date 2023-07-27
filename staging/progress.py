from tqdm import tqdm
from datetime import datetime

# Get the current date and time
now = datetime.now()

# Calculate the percentage of the year that has elapsed
elapsed = (now - datetime(now.year, 1, 1)).total_seconds()
total = (datetime(now.year + 1, 1, 1) - datetime(now.year, 1, 1)).total_seconds()
progress = elapsed / total * 100

# Create the progress bar
with tqdm(total=100, desc="Year Progress", unit="%") as pbar:
    pbar.update(progress)

print(pbar)