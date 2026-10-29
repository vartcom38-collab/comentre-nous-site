<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
function respond(int $status,array $data):void{http_response_code($status);echo json_encode($data,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);exit;}
$configPath=dirname(__DIR__).'/woo-private.php';
if(!is_file($configPath))respond(503,['ok'=>false,'error'=>'Configuration indisponible']);
$c=require $configPath;
$shop=rtrim((string)($c['url']??''),'/');
$ck=(string)($c['consumer_key']??'');$cs=(string)($c['consumer_secret']??'');
$stripe=(string)($c['stripe_secret_key']??'');
$webhook=(string)($c['stripe_webhook_secret']??'');
if(!$shop||!$ck||!$cs)respond(503,['ok'=>false,'error'=>'Boutique indisponible']);
function remote(string $url,string $method='GET',?array $data=null,?string $user=null):array{
 $ch=curl_init($url);$headers=['Accept: application/json'];
 if($data!==null){$headers[]='Content-Type: application/json';}
 curl_setopt_array($ch,[CURLOPT_RETURNTRANSFER=>true,CURLOPT_TIMEOUT=>25,CURLOPT_CONNECTTIMEOUT=>8,CURLOPT_HTTPHEADER=>$headers,CURLOPT_CUSTOMREQUEST=>$method]);
 if($user!==null)curl_setopt($ch,CURLOPT_USERPWD,$user);
 if($data!==null)curl_setopt($ch,CURLOPT_POSTFIELDS,json_encode($data,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES));
 $result=curl_exec($ch);$status=(int)curl_getinfo($ch,CURLINFO_HTTP_CODE);curl_close($ch);
 return ['ok'=>is_string($result)&&$status>=200&&$status<300,'status'=>$status,'body'=>json_decode(is_string($result)?$result:'',true)];
}
function stripeRequest(string $key,array $data):array{
 $ch=curl_init('https://api.stripe.com/v1/checkout/sessions');
 curl_setopt_array($ch,[CURLOPT_RETURNTRANSFER=>true,CURLOPT_TIMEOUT=>25,CURLOPT_CONNECTTIMEOUT=>8,CURLOPT_POST=>true,CURLOPT_USERPWD=>$key.':',CURLOPT_HTTPHEADER=>['Content-Type: application/x-www-form-urlencoded'],CURLOPT_POSTFIELDS=>http_build_query($data)]);
 $raw=curl_exec($ch);$status=(int)curl_getinfo($ch,CURLINFO_HTTP_CODE);curl_close($ch);
 $body=json_decode(is_string($raw)?$raw:'',true);
 return ['ok'=>$status>=200&&$status<300,'body'=>$body];
}
$action=(string)($_GET['action']??'start');
if($action==='webhook' && ($_SERVER['REQUEST_METHOD']??'')==='POST'){
 if(!$webhook)respond(503,['ok'=>false,'error'=>'Webhook non configuré']);
 $raw=file_get_contents('php://input');$sig=(string)($_SERVER['HTTP_STRIPE_SIGNATURE']??'');
 preg_match('/(?:^|,)t=(\d+)/',$sig,$time);preg_match('/(?:^|,)v1=([a-f0-9]+)/',$sig,$signature);
 if(empty($time[1])||empty($signature[1])||abs(time()-(int)$time[1])>300||!hash_equals(hash_hmac('sha256',$time[1].'.'.$raw,$webhook),$signature[1]))respond(400,['ok'=>false,'error'=>'Signature invalide']);
 $event=json_decode($raw,true);
 if(($event['type']??'')==='checkout.session.completed'){
  $session=(array)($event['data']['object']??[]);
  if(($session['payment_status']??'')==='paid'){
   $orderId=(int)($session['metadata']['woo_order_id']??0);
   if($orderId>0){
    $order=remote($shop.'/wp-json/wc/v3/orders/'.$orderId,'GET',null,$ck.':'.$cs);
    if(!$order['ok'])respond(500,['ok'=>false,'error'=>'Commande introuvable']);
    $meta=(array)($order['body']['meta_data']??[]);
    $sessionId='';foreach($meta as $m){if(($m['key']??'')==='_comentre_stripe_session')$sessionId=(string)($m['value']??'');}
    if($sessionId!==($session['id']??''))respond(400,['ok'=>false,'error'=>'Commande non concordante']);
    if(!in_array($order['body']['status']??'', ['completed','processing'],true)){
     $updated=remote($shop.'/wp-json/wc/v3/orders/'.$orderId,'PUT',['status'=>'completed','transaction_id'=>(string)($session['payment_intent']??''),'payment_method'=>'stripe','payment_method_title'=>'Stripe Checkout'], $ck.':'.$cs);
     if(!$updated['ok'])respond(500,['ok'=>false,'error'=>'Mise à jour impossible']);
    }
   }
  }
 }
 respond(200,['ok'=>true]);
}
if(($_SERVER['REQUEST_METHOD']??'')!=='POST'||$action!=='start')respond(405,['ok'=>false,'error'=>'Action non autorisée']);
if(!$stripe||!$webhook)respond(503,['ok'=>false,'error'=>'Paiement en cours de configuration']);
$origin=(string)($_SERVER['HTTP_ORIGIN']??'');
if($origin!=='' && $origin!=='https://comentrenous.marionbolomey.fr')respond(403,['ok'=>false,'error'=>'Origine interdite']);
$input=json_decode(file_get_contents('php://input'),true);
if(!is_array($input))respond(400,['ok'=>false,'error'=>'Requête invalide']);
$email=strtolower(trim((string)($input['email']??'')));
$first=trim((string)($input['first_name']??''));
$id=(int)($input['product_id']??0);
if(!filter_var($email,FILTER_VALIDATE_EMAIL)||strlen($email)>254||$id<=0)respond(400,['ok'=>false,'error'=>'Adresse e-mail ou produit invalide']);
$product=remote($shop.'/wp-json/wc/v3/products/'.$id,'GET',null,$ck.':'.$cs);
$p=(array)($product['body']??[]);
$categories=array_map(static fn($x)=>(string)($x['slug']??''),(array)($p['categories']??[]));
if(!$product['ok']||($p['status']??'')!=='publish'||empty($p['downloadable'])||empty($p['virtual'])||!array_intersect($categories,['com-en-famille','com-des-entrepreneuses']))respond(400,['ok'=>false,'error'=>'Produit non disponible']);
$order=remote($shop.'/wp-json/wc/v3/orders','POST',['status'=>'pending','created_via'=>'comentre_stripe_checkout','billing'=>['email'=>$email,'first_name'=>substr($first,0,80)],'line_items'=>[['product_id'=>$id,'quantity'=>1]],'meta_data'=>[['key'=>'_comentre_checkout','value'=>'1']]],$ck.':'.$cs);
if(!$order['ok'])respond(502,['ok'=>false,'error'=>'Impossible de préparer la commande']);
$o=(array)$order['body'];$orderId=(int)($o['id']??0);$total=(string)($o['total']??'');
$amount=(int)round((float)$total*100);
if($orderId<=0||$amount<=0||strtoupper((string)($o['currency']??'EUR'))!=='EUR')respond(502,['ok'=>false,'error'=>'Montant indisponible']);
$session=stripeRequest($stripe,['mode'=>'payment','customer_email'=>$email,'success_url'=>'https://comentrenous.marionbolomey.fr/commande/merci/?session_id={CHECKOUT_SESSION_ID}','cancel_url'=>'https://comentrenous.marionbolomey.fr/boutique/produit/?id='.$id,'client_reference_id'=>(string)$orderId,'metadata'=>['woo_order_id'=>(string)$orderId],'line_items'=>[['quantity'=>1,'price_data'=>['currency'=>'eur','unit_amount'=>$amount,'product_data'=>['name'=>(string)$p['name']]]]]]);
$sessionData=(array)($session['body']??[]);
if(!$session['ok']||empty($sessionData['id'])||empty($sessionData['url']))respond(502,['ok'=>false,'error'=>'Paiement indisponible']);
$linked=remote($shop.'/wp-json/wc/v3/orders/'.$orderId,'PUT',['meta_data'=>[['key'=>'_comentre_stripe_session','value'=>$sessionData['id']]]],$ck.':'.$cs);
if(!$linked['ok'])respond(502,['ok'=>false,'error'=>'Validation du paiement indisponible']);
respond(200,['ok'=>true,'url'=>$sessionData['url']]);
