# frozen_string_literal: true

module Novabilling
  module AddOns
    module Types
      class CreateAddOnDto < Internal::Types::Model
        field :name, -> { String }, optional: false, nullable: false
        field :code, -> { String }, optional: false, nullable: false
        field :description, -> { String }, optional: true, nullable: false
        field :invoice_display_name, -> { String }, optional: true, nullable: false, api_name: "invoiceDisplayName"
        field :prices, -> { Internal::Types::Array[Novabilling::Types::AddOnPriceDto] }, optional: false, nullable: false
        field :created_at, -> { String }, optional: true, nullable: false, api_name: "createdAt"
      end
    end
  end
end
