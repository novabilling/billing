# frozen_string_literal: true

module Novabilling
  module CreditNotes
    module Types
      class ListCreditNotesRequest < Internal::Types::Model
        field :customer_id, -> { String }, optional: true, nullable: false, api_name: "customerId"
        field :invoice_id, -> { String }, optional: true, nullable: false, api_name: "invoiceId"
        field :status, -> { Novabilling::CreditNotes::Types::ListCreditNotesRequestStatus }, optional: true, nullable: false
        field :page, -> { Integer }, optional: true, nullable: false
        field :limit, -> { Integer }, optional: true, nullable: false
      end
    end
  end
end
