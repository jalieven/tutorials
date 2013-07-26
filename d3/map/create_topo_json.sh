#!/bin/sh

ogr2ogr -s_srs EPSG:31370 -t_srs EPSG:4326 -f GeoJSON vlaamse_hoofdgemeenten.json ShapeFile/prtr_luchtdiffuus.shp

topojson -o vlaamse_hoofdgemeenten_topo.json --cartesian --simplify-proportion 0.05 --id-property gemeente vlaamse_hoofdgemeenten.json

rm vlaamse_hoofdgemeenten.json