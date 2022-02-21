mkdir data
echo "fetching latest navigo pointcalls data"
curl -o data/navigo_all_pointcalls_1789.csv "data.portic.fr/api/pointcalls/?date=1789&format=csv"
curl -o data/navigo_all_pointcalls_1787.csv "data.portic.fr/api/pointcalls/?date=1787&format=csv"
echo "install NodeJS dependencies"
npm i
mkdir public
mkdir public/data
echo "process data with Python scripts"
cd ./scripts && for f in *.py; do python3 "$f"; echo "execute python script $f"; done