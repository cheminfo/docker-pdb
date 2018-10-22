cd /usr/local/git/pdb-explorer
cat /usr/local/www/sites/www.cheminfo.org/site/pdbexplorer/map.json | sed $'s#,"map":\[{#,"map":[\\\n{#' | sed $'s#,"infos":\[{#,"infos":[\\\n{#' | sed $'s#},{#},\\\n{#g' > /usr/local/git/pdb-explorer/site/map.json
git add site/map.json
git commit -m "Update map"
git push origin master
