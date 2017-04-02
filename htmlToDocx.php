<?php
require_once "HTMLtoOpenXML.php";
	
$data = $_POST['data'];
$html = json_decode($data);

//$toOpenXML = HTMLtoOpenXML::getInstance()->fromHTML($html);

$toOpenXML = '		<w:p w:rsidR="00F74256" w:rsidRDefault="002E6183"><w:r><w:t xml:space="preserve">I am a </w:t></w:r><w:r w:rsidRPr="002E6183"><w:rPr><w:b/></w:rPr><w:t>developer</w:t></w:r><w:r><w:t>.</w:t></w:r></w:p><w:p w:rsidR="002E6183" w:rsidRPr="002E6183" w:rsidRDefault="002E6183"><w:pPr><w:rPr><w:i/></w:rPr></w:pPr><w:r w:rsidRPr="002E6183"><w:rPr><w:i/></w:rPr><w:t>Milwaukee, WI</w:t></w:r></w:p><w:p w:rsidR="002E6183" w:rsidRDefault="002E6183" w:rsidP="002E6183"><w:pPr><w:pStyle w:val="ListParagraph"/><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr></w:pPr><w:r><w:t>Subaru</w:t></w:r></w:p><w:p w:rsidR="002E6183" w:rsidRDefault="002E6183" w:rsidP="002E6183"><w:pPr><w:pStyle w:val="ListParagraph"/><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr></w:pPr><w:r><w:t>Nissan</w:t></w:r></w:p><w:p w:rsidR="002E6183" w:rsidRDefault="002E6183" w:rsidP="002E6183"><w:pPr><w:pStyle w:val="ListParagraph"/><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr></w:pPr><w:r><w:t>General Motors</w:t></w:r></w:p><w:p w:rsidR="002E6183" w:rsidRPr="002E6183" w:rsidRDefault="002E6183" w:rsidP="002E6183"><w:pPr><w:rPr><w:b/><w:i/></w:rPr></w:pPr><w:r w:rsidRPr="002E6183"><w:rPr><w:b/><w:i/></w:rPr><w:t>List 2</w:t></w:r></w:p><w:p w:rsidR="002E6183" w:rsidRDefault="002E6183" w:rsidP="002E6183"><w:pPr><w:pStyle w:val="ListParagraph"/><w:numPr><w:ilvl w:val="0"/><w:numId w:val="2"/></w:numPr></w:pPr><w:r><w:t>Item 1</w:t></w:r></w:p><w:p w:rsidR="002E6183" w:rsidRDefault="002E6183" w:rsidP="002E6183"><w:pPr><w:pStyle w:val="ListParagraph"/><w:numPr><w:ilvl w:val="0"/><w:numId w:val="2"/></w:numPr></w:pPr><w:r><w:t>Item 2</w:t></w:r><w:bookmarkStart w:id="0" w:name="_GoBack"/><w:bookmarkEnd w:id="0"/></w:p><w:p w:rsidR="002E6183" w:rsidRDefault="002E6183" w:rsidP="002E6183"><w:r><w:t>Plain Text</w:t></w:r></w:p><w:p><w:pPr><w:pStyle w:val="ListParagraph"/><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr></w:pPr><w:r><w:t>One</w:t></w:r></w:p>';

echo $toOpenXML;
//echo htmlentities($toOpenXML);

?>