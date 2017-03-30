<?php

require_once '../../../classes/CreateDocx.inc';

$docx = new CreateDocxFromTemplate('../../files/travis_brown-template.docx');

$first = 'Brian VanDeWiel';
$multiline = 'This is the first line.\nThis is the second line of text.';

$variables = array('FIRSTTEXT' => $first, 'MULTILINETEXT' => $multiline);
$options = array('parseLineBreaks' => true, 'target' => 'header');

$docx->replaceVariableByText($variables, $options);

$options = array('parseLineBreaks' => true, 'target' => 'document');

$docx->replaceVariableByText($variables, $options);

$docx->createDocx('example_replaceVariableByText_1');