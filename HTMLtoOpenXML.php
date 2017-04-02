<?php

class HTMLtoOpenXML {
	
	
	/**
	 * The only one instance of this class.
	 * @var HTMLtoOpenXML
	 */
	private static $_instance;
	 
	/**
	 * Private constructor of singleton.
	 */
	private function __construct() {
		require_once "scripts/HTMLCleaner.php";
		require_once "scripts/ProcessProperties.php";
	}
	
	/**
	 * Return the singleton instance. Creates one if no one.
	 */
	public static function getInstance() {
		if (is_null(self::$_instance)){
			self::$_instance = new HTMLtoOpenXML();
		}
		return self::$_instance;
	}
	
	/**
	 * Converts HTML to RTF.
	 *
	 * @param input
	 * 		the HTML formated input string
	 * @return The converted string.
	 */
	public function fromHTML($htmlCode) {
		$start = 0;
		$properties = array();
		$openxml = HTMLCleaner::getInstance()->cleanUpHTML($htmlCode);
		$openxml = $this->getOpenXML($openxml);
		$openxml = $this->processBreaks($openxml);
		$openxml = $this->processListStyle($openxml);
		$openxml = ProcessProperties::getInstance()->processPropertiesStyle($openxml, $start, $properties);
		$openxml = $this->processSpaces($openxml);
		$openxml = $this->processStyle($openxml);
		
		return $openxml;
	}
	
	private function getOpenXML($text) {
		$text = "<w:p><w:r><w:t>$text</w:t></w:r></w:p>";
		return $text;
	}
	
	private function processListStyle($input) {
		$output = preg_replace("/(<ul>)/mi", '</w:t></w:r></w:p><w:p><w:r><w:t>', $input);
		$output = preg_replace("/(<\/ul>)/mi", '</w:t></w:r></w:p><w:p><w:r><w:t>', $output);
		$output = preg_replace("/(<ol>)/mi", '</w:t></w:r></w:p><w:p><w:r><w:t>', $output);
		$output = preg_replace("/(<\/ol>)/mi", '</w:t></w:r></w:p><w:p><w:r><w:t>', $output);
		$output = preg_replace("/(<li>)/mi", "</w:t></w:r><w:p startliste><w:r><w:t>", $output);
		$output = preg_replace("/(<\/li>)/mi", "", $output);
		return $output;
	}
	
	private function processBreaks($input) {
		$output = preg_replace("/(<\/p>)/mi", "</w:t></w:r></w:p><w:p><w:r><w:t>", $input);
		$output = preg_replace("/(<br>)/mi", "</w:t></w:r></w:p><w:p><w:r><w:t>", $input);
		return $output;
	}
	
	private function processSpaces($input) {
		$output = preg_replace("/(&nbsp;)/mi", " ", $input);
		$output = preg_replace("/(<w:t>)/mi", "<w:t>", $output);
		return $output;
	}
	
	private function processStyle($input) {
		$output = preg_replace("/(<w:p>)/mi", "<w:p><w:pPr></w:pPr>", $input);
		$output = preg_replace("/(<w:p startliste>)/mi", "</w:p><w:p><w:pPr><w:pStyle w:val='BulletStyle'/></w:pPr>", $output);
		//$output = preg_replace("/(<\/strong>)/mi", "</w:t></w:r></w:p><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>", $input);
		//$output = preg_replace("/(<i>)/mi", "</w:t></w:r></w:p><w:p><w:r><w:rPr><w:i/></w:rPr><w:t>", $input);
		return $output;
	}
	
	
}
	
?>