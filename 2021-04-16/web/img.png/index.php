<?PHP   
	session_start();
	$type = 'png';
	$width= 70;
	$height= 30;
	$randval = randStr(4,"NUMBER");
	$_SESSION['randcode'] = $randval;
	header("Content-type: image/".$type);
	srand((double)microtime()*1000000);
	
	if($type !='png' && function_exists('imagecreatetruecolor')){
		$im = imagecreatetruecolor($width,$height);
	}else{
		$im = imagecreate($width,$height);
	}

	$stringColor 	= ImageColorAllocate($im,22,22,190); //字体颜色
	$backColor 		= ImageColorAllocate($im,240,240,240);//背景色
	$borderColor 	= ImageColorAllocate($im,240,240,240);//边框色
	$pointColor 	= ImageColorAllocate($im,22,22,190);//点颜色
	
	imagefilledrectangle($im, 0, 0, $width - 1, $height - 1, $backColor);//背景位置
	imagerectangle($im, 0, 0, $width-1, $height-1, $borderColor); //边框位置
	//绘模糊作用的点
	for($i=0;$i < 200;$i++)
	{
		$pointX = rand(2,$width-2);
		$pointY = rand(2,$height-2);
		imagesetpixel($im, $pointX, $pointY, $pointColor);//绘模糊作用的点
	}
	
	//imagestring($im, 5, 6, 2, $randval, $stringColor); //调整字型位置

	//利用true type字型來產生圖片
	//语法: array ImageTTFText(int im, int size, int angle, int x, int y, int col, string fontfile, string text);
	//参数 size 为字形的尺寸；
	//angle 为字型的角度，顺时针计算，0 度为水平，也就是三点钟的方向 (由左到右)，90 度则为由下到上的文字；
	//x,y 二参数为文字的坐标值 (原点为左上角)；
	//参数 col 为字的颜色；
	//fontfile 为字型文件名称，亦可是远端的文件；
	//text 当然就是字符串内容了
	imagettftext($im, 18, rand(-10,10), 10, 25, $stringColor,"arial.ttf",$randval);
	$ImageFun='Image'.$type;
	$ImageFun($im);
	ImageDestroy($im);

	//产生随机字符串
	function randStr($len = 6, $format = 'ALL') {
		switch($format) {
			case 'ALL':
			  $chars='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
			break;
			case 'CHAR':
			  $chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
			break;
			case 'NUMBER':
			  $chars='0123456789';
			break;
			default :
			  $chars='0123456789';
			break;
		}
		$string="";
		while(strlen($string) < $len)
		  $string .= substr($chars,(mt_rand()%strlen($chars)),1);
		return $string;
	}

?>