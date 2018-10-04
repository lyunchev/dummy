select 
tr.id
,te.event_type
,tr.acquirer_code
,to_char(tes.updated_at::date, 'YYYY-MM-DD') as DOCUMENT_DATE,sum(te.event_amount) as event_amount
,sum(tr.total_fee) as total_fee
,sum(te.fixed_fee) as fixed_fee
,sum(te.acceleration_fee) as acceleration_fee
,sum(te.processing_fee) as processing_fee
,tr.currency
,cou.iso_code as country
,ts.transaction_status_id
,tes.transaction_event_status_id
,tr.payment_type
,case when pa.user_id is null then 0 else 1 end MIGRATED_PAYLEVEN_YN
,case when cr.card_reader_type_id is null then 0 else cr.card_reader_type_id end card_reader_type_id
from transactions tr inner JOIN merchants me ON tr.merchant_id = me.id
join TRANSACTION_STATES AS ts ON ts.transaction_id = tr.id
JOIN countries cou ON me.country_id = cou.id
JOIN transaction_events as te ON te.transaction_id = tr.id
JOIN transaction_event_states tes on te.id=tes.transaction_event_id 
left JOIN acquirers ON tr.acquirer_code = acquirers.internal_code
LEFT JOIN payleven_accounts pa ON pa.user_id= me.primary_user_id
LEFT JOIN card_readers cr ON cr.id = tr.card_reader_id
where
tes.updated_at between ${from_date} and ${to_date} --'2018-09-06' and '2018-09-07'
and 
tr.tx_result='11'
--  and tr.id = 160395882 -- 80577638
and tr.payment_type<>1
AND ts.transaction_status_id in (2) --'CAPTURED'
AND te.event_type in ('PAYOUT', 'CHARGE_BACK', 'REFUND')
AND tes.transaction_event_status_id in (17, 15, 11, 102) --'ROGER_THAT'
and tr.acquirer_code is not null and tr.acquirer_code <> '10300'
--and currency = 'CHF'
 and cou.iso_code not in ('BR', 'CL', 'US')
  group by 
tr.currency
,tr.acquirer_code
,date(tes.updated_at)
,cou.iso_code
,ts.transaction_status_id
,te.event_type
,tes.transaction_event_status_id
,tr.payment_type
,MIGRATED_PAYLEVEN_YN
,tr.id
,card_reader_type_id
order by country
--  limit 100