#!/bin/bash
set -x
tmp=$(mktemp -d)
tar=$1
tar -xf $tar -C $tmp
here=$(pwd)
pushd $tmp
./run_ffmpeg.bash
mv video.mp4 ${tar}.mp4
popd
rm -rf $tmp
