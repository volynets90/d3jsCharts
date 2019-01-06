<?php 
if (isset($_POST['prize-name']) & isset($_POST['prize-link']) & isset($_POST['prize-price'])) { 
    $name=$_POST['prize-name'];
    $link = $_POST['prize-link'];
    $price = $_POST['prize-price'];
    $file = file_get_contents('../html/prize.json');  // Открыть файл data.json
    $taskList = json_decode($file, true);        // Декодировать в массив 
    unset($file);                               // Очистить переменную $file
    $taskList [] = array('name'=>$name, 'link'=>$link, 'price' =>$price);         // Представить новую переменную как элемент массива, в формате 'ключ'=>'имя переменной'
    file_put_contents('../html/prize.json', json_encode($taskList));  // Перекодировать в формат и записать в файл.
    unset($taskList);
}


if (isset($_POST['deleteID'])) {
    $file = file_get_contents('../html/prize.json');         // Открыть файл data.json
    $taskList = json_decode($file, true);                  // Декодировать в массив 
    foreach ($taskList as $key => $value) {        // Найти в массиве  
        if (in_array($deleteID, $value)) {           // Переменную $current
            unset($taskList[$key]);             // после обнаружения удалить
        }
    }
    file_put_contents('../html/prize.json', json_encode($taskList)); // Перекодировать в формат и записать в файл.
    unset($taskList);                           // Очистить переменную $taskList 
    file_put_contents('../html/prize.json', json_encode($taskList)); // Перекодировать в формат и записать в файл.
    unset($taskList);
    }
?>