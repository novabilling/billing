# frozen_string_literal: true

module Novabilling
  module Invoices
    module Types
      class ListInvoicesRequest < Internal::Types::Model
        field :status, -> { String }, optional: true, nullable: false
        field :customer_id, -> { String }, optional: true, nullable: false, api_name: "customerId"
        field :date_from, -> { String }, optional: true, nullable: false, api_name: "dateFrom"
        field :date_to, -> { String }, optional: true, nullable: false, api_name: "dateTo"
        field :page, -> { Integer }, optional: true, nullable: false
        field :limit, -> { Integer }, optional: true, nullable: false
      end
    end
  end
end
