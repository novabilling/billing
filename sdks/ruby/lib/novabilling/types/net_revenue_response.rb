# frozen_string_literal: true

module Novabilling
  module Types
    class NetRevenueResponse < Internal::Types::Model
      field :gross_revenue, -> { Integer }, optional: false, nullable: false, api_name: "grossRevenue"
      field :refunds, -> { Integer }, optional: false, nullable: false
      field :credit_notes, -> { Integer }, optional: false, nullable: false, api_name: "creditNotes"
      field :net_revenue, -> { Integer }, optional: false, nullable: false, api_name: "netRevenue"
    end
  end
end
