#= require active_admin/base

@assign = (anomaly_id, appointment_id) ->

  r = confirm("Are you sure?")
  if r is true
    $.ajax "/registered_anomalies/assign",
      type: 'POST'
      data: {id: anomaly_id}
      dataType: 'json'
      error: (jqXHR, textStatus, errorThrown) ->
        alert('Error. Intenta de nuevo.')
      success: (data, textStatus, jqXHR) ->
        window.location.href = "/admin/citas/" + appointment_id + "/edit"

@reject = (anomaly_id, appointment_id) ->

  r = confirm("Are you sure?")
  if r is true
    $.ajax "/registered_anomalies/reject",
      type: 'POST'
      data: {id: anomaly_id}
      dataType: 'json'
      error: (jqXHR, textStatus, errorThrown) ->
        alert('Error. Intenta de nuevo.')
      success: (data, textStatus, jqXHR) ->
        window.location.href = "/admin/citas/" + appointment_id + "/edit"

@forcePayment = (appointment_id) ->

  r = confirm("Are you sure?")
  if r is true
    $.ajax "/appointments/#{appointment_id}/force_pay",
      type: 'POST'
      dataType: 'json'
      error: (jqXHR, textStatus, errorThrown) ->
        alert('Error. Intenta de nuevo.')
      success: (data, textStatus, jqXHR) ->
        window.location.href = "/admin/citas/" + appointment_id + "/edit"

@forceCharge = (appointment_id) ->
  
  r = confirm("Are you sure?")
  if r is true
    $.ajax "/appointments/#{appointment_id}/force_charge",
      type: 'POST'
      dataType: 'json'
      error: (jqXHR, textStatus, errorThrown) ->
        alert('Error. Intenta de nuevo.')
      success: (data, textStatus, jqXHR) ->
        window.location.href = "/admin/citas/" + appointment_id + "/edit"

@assign_other = (appointment_id, path) ->

  r = confirm("Are you sure?")
  if r is true
    window.location.href = "#{path}?appointment_id=#{appointment_id}"

@changeVisible = (review_id, activate) ->
  $.ajax "/reviews/#{review_id}/activate?activate=#{activate}",
    type: 'POST'
    dataType: 'html'
    error: (jqXHR, textStatus, errorThrown) ->
      alert('Error. Intenta de nuevo.')
    success: (data, textStatus, jqXHR) ->
      $("#visible_link_#{review_id}").attr('onclick', "changeVisible(#{review_id}, #{!activate})")
