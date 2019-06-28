# to run the script use => .\auto.ps1 command line
# needs npm: rollup and butternut

$roll = 'rollup -c'
$butt = 'butternut -i ./dist/game.js -o ./dist/game.min.js'

Invoke-Expression $roll
Invoke-Expression $butt
