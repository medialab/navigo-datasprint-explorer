mkdir data
mkdir public
mkdir public/data
echo "fetching latest navigo pointcalls data"
curl -o data/navigo_all_pointcalls_1789.csv "data.portic.fr/api/pointcalls/?date=1789&format=csv"
curl -o data/navigo_all_pointcalls_1787.csv "data.portic.fr/api/pointcalls/?date=1787&format=csv"
echo "fetching latest navigo flows data"
curl -o data/navigo_all_flows_1789.csv "data.portic.fr/api/rawflows/?date=1789&format=csv"
curl -o data/navigo_all_flows_1787.csv "data.portic.fr/api/rawflows/?date=1787&format=csv"
echo "copy JSON data, contains fields"
cp src/json/navigo-flows-fields.json src/json/navigo-pointcalls-fields.json public/data/
echo "install NodeJS dependencies"
npm i
echo "process data with Python scripts"
cd ./scripts && for f in *.py; do python3 "$f"; echo "execute python script $f"; done