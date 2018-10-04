select 
tr.id
,a.event_type
,tr.acquirer_code
 ,to_char(aa.updated_at::date, 'YYYY-MM-DD') as DOCUMENT_DATE
 ,sum(a.event_amount) as event_amount
 ,sum(a.fixed_fee) as fixed_fee
 ,sum(a.acceleration_fee) as acceleration_fee
 ,sum(a.processing_fee) as processing_fee
 ,tr.currency
 ,cou.iso_code as COUNTRY
 ,aa.transaction_event_status_id
 ,case when a.DESTINATION_event_id is null then 0 else a.DESTINATION_event_id end DESTINATION_EVENT
 ,case when pe.paid is true then 1 else 0 end paid
 ,case when aa.comment is null then '' else aa.comment end comment1
 ,case when ba.iban is null then '' else ba.iban end iban
from transactions tr --on tr.id=a.transaction_id 
JOIN transaction_events a on tr.id=a.transaction_id  
JOIN transaction_event_states aa on a.id=aa.transaction_event_id
JOIN merchants me ON tr.merchant_id = me.id
JOIN countries cou ON me.country_id = cou.id
left join payout_events pe on aa.payout_event_id=pe.id
left join bank_accounts ba on pe.bank_account_id=ba.id
where aa.updated_at between ${from_date} and ${to_date} -- where aa.updated_at between '2018-05-10' and '2018-05-11'
 and   ( (a.event_type in ('PAYOUT') 
 	   AND aa.transaction_event_status_id in (24)  --'PAID_OUT' NEW
		 )
		 
	or( a.event_type in ('CHARGE_BACK')
 	   AND aa.transaction_event_status_id in (102)
	   and EXISTS(SELECT 1 FROM transaction_events where transaction_id = tr.id and event_type = 'PAYOUT' and current_status_id = 24)) --CHARGE_BACKR
	or( a.event_type in ('REFUND') 
 	   AND aa.transaction_event_status_id in (11)
	   and EXISTS(SELECT 1 FROM transaction_events where transaction_id = tr.id and event_type = 'PAYOUT' and current_status_id = 24))  -- REFUNDED
    or( a.event_type = 'CHARGE_BACK'
 	   AND aa.transaction_event_status_id in (15) ) --'CHARGE_BACK'
    or( a.event_type = 'CHARGE_BACK'
 	   AND aa.transaction_event_status_id in (103) ) --'CHARGE_BACKD'
	or( a.event_type = 'PAYOUT'
 	   AND aa.transaction_event_status_id in (21) ) --'WITHHELD'
	   
	   )
--and tr.id = 38979389
and tr.acquirer_code is not null and tr.acquirer_code <> '10300'
and cou.iso_code not in ('BR', 'CL', 'US')
and tr.payment_type<>1
 group by 
tr.currency
, tr.acquirer_code
, ba.bank_account_sap_id
, DOCUMENT_DATE
, cou.iso_code
, a.event_type
, aa.transaction_event_status_id
, DESTINATION_EVENT
, pe.paid
, aa.comment
, ba.iban
, tr.id