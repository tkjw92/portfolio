<?php

$total = $_POST["total"];

$exist = [];

function acak(){
    global $total, $exist;
    $randomInt = rand(0, ($total - 1));
    if(in_array($randomInt, $exist)){
        acak();
    }else{
        array_push($exist, $randomInt);
    }
}

for ($i=0; $i < $total; $i++) { 
    acak();
    echo $i + 1 . " " . $_POST["nama" . $exist[$i]];
    echo "<br>";
}