<?php

require_once '../../../classes/CreateDocx.inc';

$docx = new CreateDocxFromTemplate('../../files/TemplatePipeSymbol.docx');


$docx->setTemplateSymbol('|');

$docx->replaceVariableByText(array('FIRST' => 'Hello World!'));


$docx->createDocx('example_setTemplateSymbol_1');