<?php

require_once 'phpdocx/classes/CreateDocx.inc';

$data = $_POST['data'];

$docx = new CreateDocxFromTemplate('examples/Travis Brown/travis_brown-template.docx');

$first = 'Brian VanDeWiel';
$multiline = 'This is the first line.\nThis is the second line of text.';

foreach($data as $key => $value){
    $variables[$key] = $value;
}

echo "<pre>";
print_r($variables);
echo "</pre>";

$options = array('parseLineBreaks' => true, 'target' => 'header');

$docx->replaceVariableByText($variables, $options);

$options = array('parseLineBreaks' => true, 'target' => 'document');

$docx->replaceVariableByText($variables, $options);

$docx->createDocx('travis_brown_resume.docx');

?>