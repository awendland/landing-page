<?php

$subFolderPath = 'landing';

$html = file_get_contents($subFolderPath . '/index.html');

echo preg_replace('/\<(script|style|img|link)((?:(?!(>)).)*)(href|src)="((?:(?!(http|>)).)*)"/i', '<$1$2$4="' . $subFolderPath . '/' . '$5"',$html);

?>