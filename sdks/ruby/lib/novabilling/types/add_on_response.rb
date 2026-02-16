# frozen_string_literal: true

module Novabilling
  module Types
    class AddOnResponse < Internal::Types::Model
      field :id, -> { String }, optional: false, nullable: false
      field :name, -> { String }, optional: false, nullable: false
      field :code, -> { String }, optional: false, nullable: false
      field :description, -> { String }, optional: true, nullable: false
      field :invoice_display_name, -> { String }, optional: true, nullable: false, api_name: "invoiceDisplayName"
      field :prices, -> { Internal::Types::Array[Novabilling::Types::AddOnPriceResponse] }, optional: false, nullable: false
      field :created_at, -> { String }, optional: false, nullable: false, api_name: "createdAt"
      field :updated_at, -> { String }, optional: false, nullable: false, api_name: "updatedAt"
    end
  end
end
