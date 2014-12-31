if @appointment.log
  json.success false
  json.error @appointment.log
else
  json.success true
end
