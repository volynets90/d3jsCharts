<?php 
if (isset($_POST['prize-name']) & isset($_POST['prize-link']) & isset($_POST['prize-price'])) {
    $name = $_POST['prize-name'];
    $link = $_POST['prize-link'];
    $price = $_POST['prize-price'];
    $file = file_get_contents('../html/prize.json');  // Открыть файл data.json
    $taskList = json_decode($file, true);        // Декодировать в массив 
    unset($file);                               // Очистить переменную $file
    $taskList[] = array('name' => $name, 'link' => $link, 'price' => $price);         // Представить новую переменную как элемент массива, в формате 'ключ'=>'имя переменной'
    file_put_contents('../html/prize.json', json_encode($taskList));  // Перекодировать в формат и записать в файл.
    unset($taskList);
}

if (isset($_POST['deleteID'])) {
    $deleteIndex_arr = array();
    $deleteIndex_arr=$_POST['deleteID'];
    $file = file_get_contents('../html/prize.json');
    $taskList = json_decode($file, true);
    foreach ($deleteIndex_arr as $i) {
        unset($taskList[$i]);
    }
    $taskList=array_values($taskList);
    file_put_contents('../html/prize.json', json_encode($taskList)); // Перекодировать в формат и записать в файл.

}
?>