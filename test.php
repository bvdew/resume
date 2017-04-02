<?php
	// this is a test page for HTMLtoOpenXML 
	require_once "HTMLtoOpenXML.php";
	
	$html = '<p>Rendez-vous ensuite dans le menu <em>Preferences</em> de VirtualBox (general et non deune machine virtuelle) puis dans leonglet <em>Reseau</em>. Nous allons modifier le reseau prive hete par defaut de VirtualBox (e priori <code>vboxnet0</code>) en cliquant sur le tournevis, et en renseignant leonglet <em>Interface</em> comme ceci :</p><ul><li>Item 1</li></ul><strong>I am a developer.</strong>';
	
	echo htmlentities($html);
	echo "<br>";

	$toOpenXML = HTMLtoOpenXML::getInstance()->fromHTML($html);
	
	echo "<br>";
	echo htmlentities($toOpenXML);


?>