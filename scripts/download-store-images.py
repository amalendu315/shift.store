from urllib.request import urlopen,Request
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
root=Path('public/images');root.mkdir(parents=True,exist_ok=True)
assets={'living':'https://images.pexels.com/photos/6186816/pexels-photo-6186816.jpeg?auto=compress&cs=tinysrgb&w=1600','vases':'https://images.unsplash.com/photo-1541385184612-2b78118e5f1f?auto=format&fit=crop&w=800&q=85','lamp':'https://images.unsplash.com/photo-1555475384-a0aefc775412?auto=format&fit=crop&w=800&q=85','plants':'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=700&q=85','art':'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=700&q=85','aroma':'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=700&q=85','interior':'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1000&q=85','festive':'https://images.unsplash.com/photo-1514517521153-1be72277b32f?auto=format&fit=crop&w=700&q=85'}
def get(item):
 name,url=item;target=root/(name+'.jpg')
 if target.exists():return name+' cached'
 with urlopen(Request(url,headers={'User-Agent':'ShiftStore development'}),timeout=30) as r:
  if not r.headers.get('Content-Type','').startswith('image/'):raise Exception('Not an image')
  target.write_bytes(r.read())
 return name+' saved'
with ThreadPoolExecutor(max_workers=4) as pool:
 for result in pool.map(get,assets.items()):print(result)
